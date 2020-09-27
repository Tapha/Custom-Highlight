// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "customHighlight",
				defaults = {
					actions: [{"test_action":"Test action"}],
					position: "left",
					textcolor: "on",
					backgroundcolor: "off"

		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
						// retrieve the mouse coordinates if needed
						var mouseX;
						var mouseY;

						jQuery(document).mousemove(function (e) {
						  mouseX = e.pageX;
						  mouseY = e.pageY - 10;
						});

						var self = this;

						$(this.element).mouseup(function (e) {
						    if (self.getSelectedText() != "") {
						      var curr_span_id = self.add_cs_class(self.getSelectedText());
						      var curr_span_id_for_use = '#' + curr_span_id;

						      //Check settings and apply colors if needed.
						      if (self.settings.textcolor == "on")
						      {
						      	  var r_color = '#' + Math.random().toString(16).slice(2, 8);
						      	  $("#" + curr_span_id).css('color', r_color);
						      }
						      
							  if (self.settings.backgroundcolor == "on")
							  {
							  	 var b_color = '#' + Math.random().toString(16).slice(2, 8);

							  	  if (r_color != b_color)
								  {
								  			//Add classes to element for checking

								  			$( "#" + curr_span_id ).add( ".light" ).css( "color", "#3A393C" );
								  			$( "#" + curr_span_id ).add( ".dark" ).css( "color", "#FBFBFB" );

								  			//Assign the element a background color

								  			$("#" + curr_span_id).css('background-color', b_color);

									  		// Target your element

	    									$("#" + curr_span_id).colourBrightness();
								  }
								  else {
								  		var b_color = '#' + Math.random().toString(16).slice(2, 8);

								  		//Add classes to element for checking

							  			$( "#" + curr_span_id ).add( ".light" ).css( "color", "#3A393C" );
							  			$( "#" + curr_span_id ).add( ".dark" ).css( "color", "#FBFBFB" );

							  			//Assign the element a background color
							  			
								  		$("#" + curr_span_id).css('background-color', b_color);

								  		// Target your element

	    								$("#" + curr_span_id).colourBrightness();
								  }	
							  }								  							      

						      //Check number of objects within json array. If more than one then remove the default and proceed to iterate through the actions to create the relevant buttons.
						      var num_of_objects = self.settings.actions.length;

						      var all_actions = self.settings.actions; 

						      var first;	
						      for (var key in all_actions[0]) {
						      	 //Get first object
						         first = key;
						         
							  }

						      if (first == "test_action")
						      {
						      	 //Set the buttons
						      	 var all_buttons = "<button type='button' class='btn' onclick=test_action('" + curr_span_id_for_use + "')>Test Action</button>";
						      }	
						      else
						      {

								 var arr = [];

									for(var x in all_actions){
									  	
									  	arr.push(all_actions[x]);

									  	var buttons = '';
									  	
									  	for (var i in arr) {
									  		var but_array = arr[i];
									  		var the_ch_function_name = Object.keys(but_array)[0];
									  		var the_ch_value_name = but_array[the_ch_function_name];

										  	buttons = buttons + "<button type='button' class='btn' onclick="+ the_ch_function_name + "('" + curr_span_id_for_use + "')>" + the_ch_value_name + "</button>" + " ";
										  
										}
											
										//Set the buttons
						      			var all_buttons = buttons;								  
									}
						      		
						      }						     

						      $("#" + curr_span_id).tooltipster({
						          content: all_buttons,
						          multiple: true,
						          position: self.settings.position,
						          delay: 100,
						          maxWidth: 500,
						          speed: 300,
						          interactive: true,          
						          animation: 'grow',
						          trigger: 'hover',
						          contentAsHTML: true
						    });
						    }
						  });


				},
				getSelectedText: function () {
						// some logic
						var t = (document.all) ? document.selection.createRange().text : document.getSelection();
 						return t;
				},
				add_cs_class: function (s_text) {
						// some logic
						var selection = s_text;
					    var selection_text = selection.toString();
					    
					    // Add a span around the selected text, along with a class and an ID
					    
					    var span = document.createElement('SPAN');
						//span.textContent = " + " + selection_text + " + ";
						span.textContent = selection_text;
					    span.classList.add("cs-editing");
					    span.classList.add("tooltip");
					  
					    var range = selection.getRangeAt(0);
					    range.deleteContents();
					    range.insertNode(span);
					  
					    var custom_hash_1 = Math.random().toString(36).slice(2);
					    span.id = "cs-editing-" + custom_hash_1;
					    
					    return span.id;
				},
				test_action: function () {
						alert("Here's a Test Action!");
				}	
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
