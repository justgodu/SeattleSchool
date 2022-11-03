import {Body, Controller, Get, HttpException, HttpStatus, Post, Req, Request, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {User} from "../../model/user.schema";
import {UserService} from "../user/user.service";
import {AuthGuard} from "@nestjs/passport";
import {SamlAuthGuard} from "./saml.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
const moment = require('moment');
const pako = require('pako');
const uuid = require('uuid');

@Controller('')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService) {
    }

    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        try {
            await this.userService.signup(user);
        }catch (e){
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: "User already registered"
            })
        }

        return response.status(HttpStatus.CREATED).json(await this.authService.login(user))
    }

    @Post('/login')
    async login(@Body() req) {
        return this.authService.login(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate')
    async validate(){
        return true;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('google_redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.userService.getOne(req.user.email);
        let userEmail: string = req.user.email;
        let userFirstName: string = req.user.firstName;
        let userLastName: string = req.user.lastName;
        let userGoogleToken: string = req.user.acceessToken;
        let redirectUrl;
        if (!user) {
            let newUser = new User()
            newUser.is_google_user = true;
            newUser.username = userFirstName[0] + userLastName;
            newUser.email = userEmail;
            newUser.first_name = userFirstName;
            newUser.last_name = userLastName;
            newUser.google_token = userGoogleToken;
            await this.userService.signup(newUser)

            redirectUrl = new URL(process.env.FRONT_END_TOKEN_VALIDATION_PATH + '?googleAccessToken=' + req.user.accessToken + '&email=' + req.user.email);
        } else {
            await this.userService.updateGoogleToken(req.user.email, req.user.accessToken)
            redirectUrl = new URL(process.env.FRONT_END_TOKEN_VALIDATION_PATH + '?googleAccessToken=' + req.user.accessToken + '&email=' + req.user.email);
        }

        res.redirect(redirectUrl.toString());
    }

    @Post('genGoogleToken')
    async googleLogin(@Body() requestBody) {

        const googleUser = await this.userService.getOne(requestBody.username);

        if (googleUser && requestBody.accessToken) {

            let tempUser = new User();
            tempUser.username = requestBody.username;
            tempUser.google_token = requestBody.accessToken;

            let loginData = await this.authService.login(tempUser);
            if(!loginData){
                return false;
            }

            await this.userService.updateGoogleToken(requestBody.username, '')

            return loginData;

        }

        return false

    }


    @Post('saml_redirect')
    async samlAuth(@Res() res){

        const config = {
            // domain of email address for identifying on client side if SAML is enable for same or not
            "domain": "outlook.com",
            // unique entityId while setting up SAML server
            "entityURI": "https://example.com",
            // SAML server login url, can be found in SAML XML file
            "entryPoint": "https://login.microsoftonline.com/123456-xxxx-xxxx-xxxx-123456/saml2",
            // X 509 signing certificate, can be found in SAML XML file
            "certificate": "MIIC8DCCAdigAwIBAgIQaKWqA3vVf7ZPHf5h52SkkjANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXMIIC8DCCAdigAwIBAgIQaKWqA3vVf7ZPHf5h52SkkjANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQX8MIIC8DCCAdigAwIBAgIQaKWqA3vVf7ZPHf5h52SkkjANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQX",
            // callback url after successfully authentication
            "entityReplyUrl": "http://localhost:3000/api/v1/auth/saml"
        }

        const SAMLReq = `<samlp:AuthnRequest
                            xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
                            ID="${config.domain}${uuid.v4()}"
                            Version="2.0"
                            IssueInstant="${moment().utc().format()}"
                            IsPassive="false"
                            AssertionConsumerServiceURL="${config.entityReplyUrl}" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                            ForceAuthn="false">
                              <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">
                                ${config.entityURI}
                              </Issuer>
                              <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
                              </samlp:NameIDPolicy>
                        </samlp:AuthnRequest>`
        const deflatedSAMLReq = pako.deflateRaw(SAMLReq)
        const deflatedBase64SAMLReq = new Buffer(deflatedSAMLReq).toString('base64')
        const encodedDeflatedBase64SAMLReq = encodeURIComponent(deflatedBase64SAMLReq);
        res.redirect(config.entryPoint.indexOf('?')
        ? `${config.entryPoint}&SAMLRequest=${encodedDeflatedBase64SAMLReq}`
        : `${config.entryPoint}?SAMLRequest=${encodedDeflatedBase64SAMLReq}`);
    }

    @Get('saml')
    @UseGuards(SamlAuthGuard)
    async samlLogin() {
        //this route is handled by passport-saml
        return;
    }

    @Post('saml_callback')
    @UseGuards(SamlAuthGuard)
    async samlAssertionConsumer(
        @Request() req,
        @Res() res,
    ) {
        console.log(req.user, "- SAML USER");
        const user = await this.userService.getOne(req.user.email);
        let userEmail: string = req.user.email;
        let userFirstName: string = req.user.firstName;
        let userLastName: string = req.user.lastName;
        let userGoogleToken: string = req.user.acceessToken;
        let redirectUrl;
        if (!user) {
            let newUser = new User()
            newUser.is_google_user = true;
            newUser.username = userFirstName[0] + userLastName;
            newUser.email = userEmail;
            newUser.first_name = userFirstName;
            newUser.last_name = userLastName;
            newUser.google_token = userGoogleToken;
            await this.userService.signup(newUser)

            redirectUrl = new URL(process.env.FRONT_END_TOKEN_VALIDATION_PATH + '?googleAccessToken=' + req.user.accessToken + '&email=' + req.user.email);
        } else {
            await this.userService.updateGoogleToken(req.user.email, req.user.accessToken)
            redirectUrl = new URL(process.env.FRONT_END_TOKEN_VALIDATION_PATH + '?googleAccessToken=' + req.user.accessToken + '&email=' + req.user.email);
        }

            res.redirect(redirectUrl);

    }

}
