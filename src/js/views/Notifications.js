import { html } from 'htm/preact';
import iris from 'iris-lib';
import { createRef } from 'preact';

import MessageFeed from '../components/MessageFeed';
import Nostr from '../Nostr';
import { translate as t } from '../translations/Translation';

import View from './View';

export default class Notifications extends View {
  class = 'public-messages-view';
  ref = createRef();

  componentDidMount() {
    Nostr.getNotifications((notifications) => {
      const hasNotifications = notifications.length > 0;
      if (hasNotifications && this.ref.current) {
        iris
          .local()
          .get('notificationsSeenTime')
          .put(Math.floor(Date.now() / 1000));
        iris.local().get('unseenNotificationCount').put(0);
      }
      this.setState({ hasNotifications });
    });
  }

  renderView() {
    return html`
      <div ref=${this.ref} class="centered-container" style="margin-bottom: 15px;">
        ${this.state.hasNotifications
          ? html`<br class="hidden-xs" />`
          : html`<p class="mobile-padding15">${t('no_notifications_yet')}</p> `}
        <${MessageFeed}
          scrollElement=${this.scrollElement.current}
          key="notifications"
          index="notifications"
        />
      </div>
    `;
  }
}
