import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'launch',
    loadChildren: () =>
      import('./launch/launch.module').then((m) => m.LaunchPageModule),
  },
  {
    path: '',
    redirectTo: 'launch',
    pathMatch: 'full',
  },
  {
    path: 'quick-login',
    loadChildren: () =>
      import('./quick-login/quick-login.module').then(
        (m) => m.QuickLoginPageModule
      ),
  },
  {
    path: 'project-list',
    loadChildren: () =>
      import('./project-list/project-list.module').then(
        (m) => m.ProjectListPageModule
      ),
  },
  {
    path: 'project-detail',
    loadChildren: () =>
      import('./project-detail/project-detail.module').then(
        (m) => m.ProjectDetailPageModule
      ),
  },
  {
    path: 'live-feed',
    loadChildren: () =>
      import('./live-feed/live-feed.module').then((m) => m.LiveFeedPageModule),
  },
  {
    path: 'create-post',
    loadChildren: () =>
      import('./create-post/create-post.module').then(
        (m) => m.CreatePostPageModule
      ),
  },
  {
    path: 'payment-history',
    loadChildren: () =>
      import('./payment-history/payment-history.module').then(
        (m) => m.PaymentHistoryPageModule
      ),
  },
  {
    path: 'volunteer-list',
    loadChildren: () =>
      import('./volunteer-list/volunteer-list.module').then(
        (m) => m.VolunteerListPageModule
      ),
  },
  {
    path: 'task-list',
    loadChildren: () =>
      import('./task-list/task-list.module').then((m) => m.TaskListPageModule),
  },
  {
    path: 'add-volunteer',
    loadChildren: () =>
      import('./add-volunteer/add-volunteer.module').then(
        (m) => m.AddVolunteerPageModule
      ),
  },
  {
    path: 'sos',
    loadChildren: () => import('./sos/sos.module').then((m) => m.SosPageModule),
  },
  {
    path: 'contact-list',
    loadChildren: () =>
      import('./contact-list/contact-list.module').then(
        (m) => m.ContactListPageModule
      ),
  },
  {
    path: 'events-tabbar',
    loadChildren: () =>
      import('./events-tabbar/events-tabbar.module').then(
        (m) => m.EventsTabbarPageModule
      ),
  },
  {
    path: 'events-tab-explore',
    loadChildren: () =>
      import('./events-tab-explore/events-tab-explore.module').then(
        (m) => m.EventsTabExplorePageModule
      ),
  },
  {
    path: 'events-tab-hosting',
    loadChildren: () =>
      import('./events-tab-hosting/events-tab-hosting.module').then(
        (m) => m.EventsTabHostingPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'scan-qr',
    loadChildren: () =>
      import('./scan-qr/scan-qr.module').then((m) => m.ScanQrPageModule),
  },
  {
    path: 'record-payment',
    loadChildren: () =>
      import('./record-payment/record-payment.module').then(
        (m) => m.RecordPaymentPageModule
      ),
  },
  {
    path: 'receipt-form',
    loadChildren: () =>
      import('./receipt-form/receipt-form.module').then(
        (m) => m.ReceiptFormPageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },  {
    path: 'task-comment',
    loadChildren: () => import('./task-comment/task-comment.module').then( m => m.TaskCommentPageModule)
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then( m => m.MyAccountPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
