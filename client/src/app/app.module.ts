import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TimeAgoPipe} from 'time-ago-pipe';

import { ShowAuthedDirective } from './directives/show-authed.directive';

import { AuthGuard } from './guard/auth.guard';
import { NoAuthGuard } from './guard/no-auth.guard';
import { AdminSuperAdminGuard } from './guard/admin-super-admin.guard';
import { ProfileGuard } from './guard/profile.guard';

import { MarkdownPipe } from './pipes/markdown.pipe';

import { ApiService } from './services/api.service';
import { PhotosService } from './services/photos.service';
import { PhotoCommentsService } from './services/photo-comments.service';
import { EditablePhotoResolverService } from './services/editable-photo-resolver.service';
import { PhotosAuthResolverService } from './services/photos-auth-resolver.service';
import { JwtService } from './services/jwt.service';
import { ProfileResolverService } from './services/profile-resolver.service';
import { ProfileService } from './services/profile.service';
import { PhotoTagsService } from './services/photo-tags.service';
import { UserService } from './services/user.service';
import { PhotoDetailResolverService } from './services/photo-detail-resolver.service';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import { AppComponent } from './app.component';
import { AuthComponent } from './components/user/auth/auth.component';
import { AdminUserComponent } from './components/admin/admin-user/admin-user.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { ListErrorsComponent } from './components/list-errors/list-errors.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { PhotoEditComponent } from './components/photo/photo-edit/photo-edit.component';
import { PhotosComponent } from './components/photo/photos/photos.component';
import { PhotoCommentComponent } from './components/photo/photo-comment/photo-comment.component';
import { PhotoDetailComponent } from './components/photo/photo-detail/photo-detail.component';
import { PhotoListComponent } from './components/photo/photo-list/photo-list.component';
import { PhotoPreviewComponent } from './components/photo/photo-preview/photo-preview.component';
import { ProfilePhotosComponent } from './components/profile/profile-photos/profile-photos.component';
import { PhotosUpvoteComponent } from './components/profile/photos-upvote/photos-upvote.component';
import { PhotosDownvoteComponent } from './components/profile/photos-downvote/photos-downvote.component';
import { PhotosFollowingComponent } from './components/profile/photos-following/photos-following.component';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';


const rootRouting: ModuleWithProviders = RouterModule.forRoot([
  { path: '', component: PhotosComponent, resolve: { isAuthenticated: PhotosAuthResolverService }},
  { path: 'login', component: AuthComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: AuthComponent, canActivate: [NoAuthGuard] },
  { path: 'photos', component: PhotosComponent, resolve: { isAuthenticated: PhotosAuthResolverService }},
  { path: 'photo/:slug', component: PhotoDetailComponent, resolve: { photo: PhotoDetailResolverService }},
  { path: 'photo-edit', component: PhotoEditComponent, canActivate: [AuthGuard] },
  { path: 'photo-edit/:slug', component: PhotoEditComponent, canActivate: [AuthGuard], resolve: { photo: EditablePhotoResolverService }},
  { path: 'profile/:username', component: ProfileComponent, resolve: { profile: ProfileResolverService }, children: [
    { path: 'profile-photos', component: ProfilePhotosComponent },
    { path: 'photos-following', component: PhotosFollowingComponent, canActivate: [ProfileGuard] },
    { path: 'photos-upvote', component: PhotosUpvoteComponent, canActivate: [ProfileGuard] },
    { path: 'photos-downvote', component: PhotosDownvoteComponent, canActivate: [ProfileGuard] },
    { path: 'profile-info', component: ProfileInfoComponent }
  ]},
  { path: 'profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'admin-user', component: AdminUserComponent, canActivate: [AdminSuperAdminGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]);


@NgModule({
  declarations: [
    AppComponent,
    ShowAuthedDirective,
    ListErrorsComponent,
    FooterComponent,
    HeaderComponent,
    MarkdownPipe,
    TimeAgoPipe,
    AuthComponent,
    AdminUserComponent,
    ProfileComponent,
    ProfileEditComponent,
    PhotoEditComponent,
    PhotosComponent,
    PhotoCommentComponent,
    PhotoDetailComponent,
    PhotoListComponent,
    PhotoPreviewComponent,
    ProfilePhotosComponent,
    PhotosUpvoteComponent,
    PhotosDownvoteComponent,
    PhotosFollowingComponent,
    ProfileInfoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    rootRouting
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ShowAuthedDirective,
    AuthGuard,
    NoAuthGuard,
    AdminSuperAdminGuard,
    ProfileGuard,
    MarkdownPipe,
    ApiService,
    PhotoDetailResolverService,
    PhotosService,
    PhotoCommentsService,
    EditablePhotoResolverService,
    PhotosAuthResolverService,
    JwtService,
    ProfileResolverService,
    ProfileService,
    PhotoTagsService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
