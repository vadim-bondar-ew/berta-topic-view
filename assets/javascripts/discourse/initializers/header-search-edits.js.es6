import { withPluginApi } from 'discourse/lib/plugin-api';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { on } from 'ember-addons/ember-computed-decorators';

export default {
    name: 'header-search',
    initialize(container){

        const searchMenuWidget = container.factoryFor('widget:search-menu');
        const corePanelContents = searchMenuWidget.class.prototype['panelContents'];

        withPluginApi('0.8.9', api => {

            api.modifyClass('component:site-header', {

                @on('didInsertElement')
                initSizeWatcher() {
                    Ember.run.scheduleOnce('afterRender', () => {
                        console.log(this.$('.menu-panel.drop-down'));
                        console.log($('.menu-panel.drop-down'));
                            this.$('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    });
                },

            });

            api.reopenWidget('search-menu', {
                @on('didInsertElement')
                initSizeWatcher() {
                    Ember.run.scheduleOnce('afterRender', () => {
                        console.log(this.$('.menu-panel.drop-down'));
                        console.log($('.menu-panel.drop-down'));
                        this.$('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    });
                },

                html() {
                    console.log(this.$('.menu-panel.drop-down'));
                    console.log($('.menu-panel.drop-down'));
                    if (this.state.formFactor === 'header') {
                        return this.panelContents();
                    } else {
                        return this.attach('menu-panel', {
                            contents: () => this.panelContents()
                        });
                    }
                }
            });
        });
    }
};