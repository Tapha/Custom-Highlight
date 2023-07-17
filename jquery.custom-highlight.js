;(function ($, window, document, undefined) {

  "use strict";

  const pluginName = "customHighlight",
    defaults = {
      actions: [{"test_action": "Test action"}],
      position: "left",
      textcolor: "on",
      backgroundcolor: "off"
    };

  class Plugin {
    constructor(element, options) {
      this.element = element;
      this.settings = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    init() {
      let mouseX;
      let mouseY;

      $(document).mousemove(e => {
        mouseX = e.pageX;
        mouseY = e.pageY - 10;
      });

      $(this.element).mouseup(e => this.handleMouseUp(e));
    }

    handleMouseUp(e) {
      const selectedText = this.getSelectedText();

      if (selectedText != "") {
        const curr_span_id = this.add_cs_class(selectedText);
        const $currSpanElement = $("#" + curr_span_id);

        this.applyTextcolor($currSpanElement);
        this.applyBackgroundcolor($currSpanElement, $currSpanElement.css('color'));

        this.applyActionsToElement($currSpanElement);
      }
    }

    getSelectedText() {
      return (document.all) ? document.selection.createRange().text : document.getSelection();
    }

    applyTextcolor($element) {
      if (this.settings.textcolor == "on") {
        const r_color = '#' + Math.random().toString(16).slice(2, 8);
        $element.css('color', r_color);
      }
    }

    applyBackgroundcolor($element, r_color) {
      if (this.settings.backgroundcolor == "on") {
        let b_color = '#' + Math.random().toString(16).slice(2, 8);

        if (r_color == b_color) {
          b_color = '#' + Math.random().toString(16).slice(2, 8);
        }

        $element.addClass(".light").css("color", "#3A393C");
        $element.addClass(".dark").css("color", "#FBFBFB");

        $element.css('background-color', b_color);

        $element.colourBrightness();
      }
    }

    applyActionsToElement($element) {
      const all_actions = this.settings.actions;
      let all_buttons = "";

      if (all_actions.length > 0) {
        all_buttons = this.getButtonsFromActions(all_actions);
      }

      $element.tooltipster({
        content: all_buttons,
        multiple: true,
        position: this.settings.position,
        delay: 100,
        maxWidth: 500,
        speed: 300,
        interactive: true,
        animation: 'grow',
        trigger: 'hover',
        contentAsHTML: true
      });
    }

    getButtonsFromActions(actions) {
      const first = Object.keys(actions[0])[0];
      let buttons = "";

      if (first == "test_action") {
        buttons = "<button type='button' class='btn' onclick=test_action('" + curr_span_id_for_use + "')>Test Action</button>";
      } else {
        for (let action of actions) {
          for (let key in action) {
            buttons += "<button type='button' class='btn' onclick=" + key + "('" + curr_span_id_for_use + "')>" + action[key] + "</button> ";
          }
        }
      }

      return buttons;
    }

    add_cs_class(s_text) {
      const selection = s_text;
      const selection_text = selection.toString();
      const span = document.createElement('SPAN');

      span.textContent = " + " + selection_text + " + ";
      span.classList.add("cs-editing");
      span.classList.add("tooltip");

      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);

      const custom_hash_1 = Math.random().toString(36).slice(2);
      span.id = "cs-editing-" + custom_hash_1;

      return span.id;
    }

    test_action() {
      alert("Here's a Test Action!");
    }
  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
