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
        @observes('socialStyle','tilesStyle')
        setupListStyle() {
          if (!this.$()) {return;}
          this.$().parents('#list-area').toggleClass('social-style', this.get('socialStyle'));
          this.$().parents('#list-area').toggleClass('tiles-style', this.get('tilesStyle'));
          this.$("tbody").toggleClass('grid', this.get('tilesStyle'));
          if ( !this.$( ".grid-sizer" ).length && this.get('tilesStyle')){
            this.$(".grid").prepend("<div class='grid-sizer'></div>");
          };
        },

      });


      api.modifyClass('component:topic-list-item', {

        // Lifecyle logic

        @on('init')
        _setupProperties() {
          this.set('tagName', 'div');
          this.$().wrap("<div class='mansory'></div>");
        }

      });


    });
  }
};
