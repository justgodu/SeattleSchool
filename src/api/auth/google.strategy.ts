import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: "230354233123-15692nc21ih1qeubai154fb6da9qqjua.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/api/v1/auth/google_redirect",
            scope: ['email', 'profile'],
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { name, emails, photos } = profile
        return {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
    }
}