import {
  ApplicationConfig
}
from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling
}
from '@angular/router';

import {
  routes
}
from './app.routes';

import {
  provideHttpClient
}
from '@angular/common/http';

import {
  SocialAuthServiceConfig,
  GoogleLoginProvider
}
from '@abacritt/angularx-social-login';

export const appConfig:
ApplicationConfig = {

  providers: [

    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),

    provideHttpClient(),

    {
      provide: 'SocialAuthServiceConfig',

      useValue: {

        autoLogin: false,

        providers: [

          {

            id:
            GoogleLoginProvider.PROVIDER_ID,

            provider:
            new GoogleLoginProvider(

              'YOUR_GOOGLE_CLIENT_ID'

            )

          }

        ]

      } as SocialAuthServiceConfig

    }

  ]

};