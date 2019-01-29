import { withPluginApi } from 'discourse/lib/plugin-api';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { h } from "virtual-dom";
import { on } from 'ember-addons/ember-computed-decorators';

export default {
    name: 'header-search',
    initialize(container){

        const searchMenuWidget = container.factoryFor('widget:search-menu');
        const corePanelContents = searchMenuWidget.class.prototype['panelContents'];

        withPluginApi('0.8.9', api => {

            api.modifyClass('component:site-header', {

                toggleVisibility: function(topicToggled) {
                    console.log('11111');
                },

                @on('didInsertElement')
                initSizeWatcher() {
                    Ember.run.scheduleOnce('afterRender', () => {
                        this.toggleVisibility();
                    })
                    $(window).on('resize', Ember.run.bind(this, this.toggleVisibility));
                    this.appEvents.on('header:show-topic', () => this.toggleVisibility(true));
                    this.appEvents.on('header:hide-topic', () => this.toggleVisibility(true));
                    // Ember.run.scheduleOnce('afterRender', () => {
                    //     this.$('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    // });
                },

            });

            api.reopenWidget('search-menu', {
                html() {
                    let results = this.panelContents();
                    // results.push(h("a.close-search-panel", { attributes: {'href': '#', 'onclick': this.sendWidgetAction("toggleSearchMenu")} }, 'x'));
                    results.push(
                        this.attach("link", {
                            className: "close-search-panel",
                            title: "x",
                            label: "x"
                        })
                    );

                    if (this.state.formFactor === 'header') {
                        return results;
                    } else {
                        return this.attach('menu-panel', {
                            contents: () => results
                        });
                    }
                }
            });

        });

    }
};