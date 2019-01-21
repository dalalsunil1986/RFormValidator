(function($, env, doc) {
  const _selectorsArr = [];
  const _selectedElementsRefArr = [];

  function RFormValidator(selector = null) {
    try {
      this.selector = selector;
      var rfv = this;

      const _selectedElementRef = (rfv.selectedElemRef = _getSelectedElementRef(
        selector
      ));

      const _patterns = {
        alphanumeric: new RegExp("^[a-zA-Z0-9_]*$"),
        alpha: new RegExp("^[a-zA-Z]*$"),
        numeric: new RegExp("^[0-9]*$")
      };

      function _addNewSelector() {
        try {
          var selectedElemRef = doc.querySelector(selector);

          if (selectedElemRef) {
            _selectorsArr.push(selector);
            _selectedElementsRefArr.push(selectedElemRef);

            return _selectedElementsRefArr[_selectedElementsRefArr.length - 1];
          }

          return false;
        } catch (e) {
          console.error(e);
        }
      }

      function _getSelectedElementRef(selector = "") {
        try {
          //First search for same select element
          if (selector != null) {
            if (_selectorsArr.length > 0) {
              var i = _selectorsArr.indexOf(selector);

              if (i >= 0) {
                //Same selector found
                return _selectedElementsRefArr[i];
              } else {
                //Look for selected element ref but with different selector

                function _matchDom(ref) {
                  if (ref === selectedElemRef) {
                    return 1;
                  }

                  return -1;
                }

                i = _selectedElementsRefArr.findIndex(_matchDom);

                if (i >= 0) {
                  return _selectedElementsRefArr[i];
                } else {
                  return _addNewSelector();
                }
              }
            } else {
              return _addNewSelector();
            }
          }

          return false;
        } catch (e) {
          console.error(e);
        }
      }

      function _getInputElements(sf = null) {
        try {
          var elems = [];

          if (sf !== null && sf instanceof HTMLElement) {
            elems = sf.querySelectorAll("input,select,textarea");
          }

          return elems;
        } catch (e) {
          console.error(e);
        }
      }

      function _checkForRequired(field = null) {
        if (field.value.trim() === "") {
          return false;
        } else {
          return true;
        }
      }

      function _checkForAlphanumeric(field = null) {
        return _patterns.alphanumeric.test(field.value.trim());
      }

      function _checkForAlphabets(field = null) {
        return _patterns.alpha.test(field.value.trim());
      }

      function _checkForAlphabets(field = null) {
        return _patterns.alpha.test(field.value.trim());
      }

      function _checkForNumeric(field = null) {
        return _patterns.numeric.test(field.value.trim());
      }

      function _checkFieldValidity(field = null) {
        try {
          var _response = 1;

          if (field.hasAttribute("required") && !_checkForRequired(field)) {
            _response = 101;
          } else if (
            field.hasAttribute("rfv-alphanumeric") &&
            field.getAttribute("rfv-alphanumeric") == "true" &&
            !_checkForAlphanumeric(field)
          ) {
            _response = 102;
          } else if (
            field.hasAttribute("rfv-alphabets") &&
            field.getAttribute("rfv-alphabets") == "true" &&
            _checkForAlphabets(field)
          ) {
            _response = 103;
          } else if (
            field.hasAttribute("rfv-numeric") &&
            field.getAttribute("rfv-numeric") == "true" &&
            _checkForNumeric(field)
          ) {
            _response = 104;
          }

          return _response;
        } catch (e) {
          console.error(e);
        }
      }

      function _getErrorMessage(field = null, options = {}, response = null) {
        try {
          if (response === 101) {
            //Required check failed
            if (field.hasAttribute("rfv-required-message")) {
              return field.getAttribute("rfv-required-message");
            } else {
              return "Field is required";
            }
          } else if (response === 102) {
            //Alphanumeric check failed
            if (field.hasAttribute("rfv-alphanumeric-message")) {
              return field.getAttribute("rfv-alphanumeric-message");
            } else {
              return "Field must contain only alphanumeric";
            }
          } else if (response === 103) {
            //Alphanumeric check failed
            if (field.hasAttribute("rfv-alphabets-message")) {
              return field.getAttribute("rfv-alphabets-message");
            } else {
              return "Field must contain only alphabets";
            }
          } else if (response === 104) {
            //Alphanumeric check failed
            if (field.hasAttribute("rfv-numeric-message")) {
              return field.getAttribute("rfv-numeric-message");
            } else {
              return "Field must contain only numbers";
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      function _showFieldError(field = null, options = {}, response = null) {
        try {
          //Check if input is warpped in any div or not
          //Check for bootstrap class
          var wrapper;

          if (
            field.parentNode.nodeName === "DIV" ||
            field.parentNode.classList.contains("form-group")
          ) {
            wrapper = field.parentNode;
          } else {
            //Create new wrapper
            wrapper = doc.createElement("div");

            var fieldLabel = field.previousElementSibling;

            // insert wrapper before field in the DOM tree
            field.parentNode.insertBefore(wrapper, field);

            if (fieldLabel && fieldLabel.nodeName === "LABEL") {
              wrapper.appendChild(label);
            }

            wrapper.appendChild(field);
          }

          if (options.hasOwnProperty("error-class")) {
            wrapper.classList.add(options["error-class"]);
          } else {
            wrapper.classList.add("has-error");
          }

          //Generate error message element
          var messageElem = doc.createElement("span");
          messageElem.classList.add("error-message");
          messageElem.innerText = _getErrorMessage(field, options, response);

          //Delete previously cretaed message element if any
          var previousMessageElem = wrapper.getElementsByClassName(
            "error-message"
          )[0];

          if (previousMessageElem) {
            previousMessageElem.parentNode.removeChild(previousMessageElem);
          }

          //Handle bootsrap select
          if (wrapper.classList.contains("bootstrap-select")) {
            previousMessageElem = wrapper.parentNode.getElementsByClassName(
              "error-message"
            )[0];

            if (previousMessageElem) {
              previousMessageElem.parentNode.removeChild(previousMessageElem);
            }

            wrapper.parentNode.insertBefore(messageElem, wrapper.nextSibling);
          } else {
            wrapper.insertBefore(messageElem, field.nextSibling);
          }
        } catch (e) {
          console.error(e);
        }
      }

      function _removeFieldError(field = null) {
        try {
          if (field !== null) {
            if (field.parentNode.classList.contains("has-error")) {
              field.parentNode.classList.remove("has-error");
              var messageElem = field.parentNode.getElementsByClassName(
                "error-message"
              )[0];

              if (messageElem instanceof Node) {
                field.parentNode.removeChild(messageElem);
              }

              if (field.parentNode.classList.contains("bootstrap_select")) {
                field.parentNode.parentNode.removeChild(
                  field.parentNode.parentNode.getElementsByClassName(
                    "error-message"
                  )[0]
                );
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      function _validateForm(formElemRef = null, options = {}) {
        try {
          if (formElemRef !== null) {
            var fields = _getInputElements(formElemRef);

            for (var j = 0; j < fields.length; j++) {
              var response = _checkFieldValidity(fields[j]);

              if (response !== 1) {
                _showFieldError(fields[j], options, response);
              } else {
                _removeFieldError(fields[j]);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      function _validateField(fieldRef = null, options = {}) {
        try {
          if (fieldRef !== null) {
            var response = _checkFieldValidity(fieldRef);

            if (response !== 1) {
              _showFieldError(fieldRef, options, response);
            } else {
              _removeFieldError(fieldRef);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      this.validate = function(options) {
        try {
          var selectedElemType = _selectedElementRef.nodeName;
          console.log(selectedElemType);

          if (selectedElemType === "FORM") {
            _validateForm(_selectedElementRef, options);
          } else if (
            selectedElemType === "INPUT" ||
            selectedElemType === "SELECT" ||
            selectedElemType === "TEXTAREA"
          ) {
            _validateField(_selectedElementRef);
          }
        } catch (e) {
          console.error(e);
        }
      };

      this.autoValidate = function(options) {
        try {
          console.log(selector + " is validated");
          console.log(_selectedElementRef);
        } catch (e) {
          console.error(e);
        }
      };
    } catch (e) {
      console.error(e);
    }
  }

  function init(selector) {
    try {
    } catch (e) {
      console.error(e);
    }
    return new RFormValidator(selector);
  }

  //Make it available globally
  window.RFormValidator = window.RFV = init;
})(jQuery, window, document);
