import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { MDL } from './MaterialDesignLiteUpgradeElement';

import { CookieService } from 'ng2-cookies';


import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService,StatService,LiveDataService,ChatService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ProfileComponent } from './profile/index';
import { FriendsComponent } from './friends/index';
import { FindPlayerComponent } from './findPlayer/index';
import { GlobalChatComponent } from './globalChat/index';
import { LeaderBoardComponent } from './leaderboard/index';
import { LandingViewComponent } from './landingView/index';

import { LoginAndRegisterComponent } from './loginAndRegister/index';

import {OrdinalPipe} from './_pipes/ordinal.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        MDL,
        OrdinalPipe,
        ProfileComponent,
        FriendsComponent,
        FindPlayerComponent,
        GlobalChatComponent,
        LeaderBoardComponent,
        LandingViewComponent,
        LoginAndRegisterComponent
        
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        BaseRequestOptions,
        CookieService,
        StatService,
        LiveDataService,
        ChatService
    ],
    
    bootstrap: [AppComponent]
})

export class AppModule { }