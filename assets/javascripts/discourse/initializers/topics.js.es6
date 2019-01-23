import { withPluginApi } from 'discourse/lib/plugin-api';
import { on, observes } from 'ember-addons/ember-computed-decorators';

export default {
  name: 'topics',
  initialize(container){

    withPluginApi('0.8.12', (api) => {

      api.modifyClass('component:topic-list',  {
        // Lifecyle logic

        @on('init')
        setup() {
          console.log("init");
          console.log("init");
          console.log("init");
          console.log("init");
        },

        @on('didInsertElement')
        setupListStyle() {
          this.$(".topic-list-item").wrapAll("<div class='mansory'></div>");
        }

      });


      api.modifyClass('component:topic-list-item', {

        // Lifecyle logic

        @on('init')
        _setupProperties() {
          this.set('tagName', 'div');
        },

      });


    });
  }
};
