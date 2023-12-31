const form = document.forms[0];

let elements = document.querySelectorAll("[data-val='true']");

elements.forEach((element) => {
  element.addEventListener("change", onChangeHandler);
});

form.addEventListener("submit", onSubmitHandler);

function onChangeHandler(e) {
  const element = e.target;
  if (element.tagName == "INPUT") {
    validateElement(element);
  }
}

function onSubmitHandler(e) {
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i];
    let valid = validateElement(element);
    if (!valid) {
      e.preventDefault();
    }
  }
}

function validateElement(element) {
  for (const key in validators) {
    if (
      Object.hasOwnProperty.call(validators, key) &&
      typeof validators[key] == "object"
    ) {
      if (element.dataset[key] !== undefined) {
        const validator = validators[key];
        if (!validator.isValid(element)) return false;
      }
    }
  }

  return true;
}

let validators = {};

validators.validate = function (element, message, predicate) {
  let errorLabel = document.querySelector("#" + element.dataset.errorLabel);
  errorLabel.innerHTML = message;
  errorLabel.classList.remove("valid");
  errorLabel.classList.remove("error");

  if (typeof predicate == "function" && predicate()) {
    errorLabel.classList.add("valid");
    errorLabel.style.visibility = "visible";
    return true;
  } else {
    errorLabel.classList.add("error");
    errorLabel.style.visibility = "visible";
    return false;
  }
};

validators.required = {
  isValid: function (element) {
    let message = element.dataset.required;
    return validators.validate(
      element,
      message,
      () => element.value.length > 0
    );
  },
};

validators.pattern = {
  isValid: function (element) {
    let message = element.dataset.required;
    let regex = new RegExp(element.dataset.pattern);
    return validators.validate(element, message, () =>
      regex.test(element.value)
    );
  },
};
