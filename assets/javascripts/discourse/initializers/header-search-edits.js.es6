import { withPluginApi } from 'discourse/lib/plugin-api';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { h } from "virtual-dom";
import { on } from 'ember-addons/ember-computed-decorators';

export default {
    name: 'header-search',
    initialize(container){

        withPluginApi('0.8.9', api => {

            api.modifyClass('component:site-header', {

                @on('didInsertElement')
                initSizeWatcher() {
                    Ember.run.scheduleOnce('afterRender', () => {
                        this.$('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    });
                }

            });

            const forceContextEnabled = ["category", "user", "private_messages"];
            let additionalPanels = [];

            api.reopenWidget('header', {

                html(attrs, state) {
                    console.log($('.search-menu'));
                    let contents = () => {
                        const panels = [
                            this.attach("header-buttons", attrs),
                            this.attach("header-icons", {
                                hamburgerVisible: state.hamburgerVisible,
                                userVisible: state.userVisible,
                                searchVisible: state.searchVisible,
                                ringBackdrop: state.ringBackdrop,
                                flagCount: attrs.flagCount,
                                user: this.currentUser
                            })
                        ];

                        if (state.searchVisible) {
                            const contextType = this.searchContextType();

                            if (state.searchContextType !== contextType) {
                                state.contextEnabled = undefined;
                                state.searchContextType = contextType;
                            }

                            if (state.contextEnabled === undefined) {
                                if (forceContextEnabled.includes(contextType)) {
                                    state.contextEnabled = true;
                                }
                            }

                            panels.push(
                                this.attach("search-menu", {contextEnabled: state.contextEnabled})
                            );
                        } else if (state.hamburgerVisible) {
                            panels.push(this.attach("hamburger-menu"));
                        } else if (state.userVisible) {
                            panels.push(this.attach("user-menu"));
                        }
                        if (this.site.mobileView) {
                            panels.push(this.attach("header-cloak"));
                        }
                        console.log(additionalPanels);
                        additionalPanels.map(panel => {
                            if (this.state[panel.toggle]) {
                                panels.push(
                                    this.attach(
                                        panel.name,
                                        panel.transformAttrs.call(this, attrs, state)
                                    )
                                );
                            }
                        });

                        return panels;
                    };
                    let contentsAttrs = { contents, minimized: !!attrs.topic };
                    return h(
                        "div.wrap",
                        this.attach("header-contents", $.extend({}, attrs, contentsAttrs))
                    );
                }

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