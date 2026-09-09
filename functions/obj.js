// Named object blueprints. A stepping stone toward class syntax:
//   l Cat = type({
//       init(name) { this.name = name },
//       speak() { return this.name + " meows" }
//   })
//   l c = new Cat("Mochi")
function type(blueprint) {
  if (!blueprint || typeof blueprint !== "object" || Array.isArray(blueprint)) {
    fail("type", "expected an object of fields and methods, got " + ayTypeName(blueprint));
  }

  function Type() {
    const keys = Object.keys(blueprint);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof blueprint[key] !== "function") {
        this[key] = blueprint[key];
      }
    }
    const init = blueprint.init || blueprint.new;
    if (typeof init === "function") {
      init.apply(this, arguments);
    }
  }

  const keys = Object.keys(blueprint);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof blueprint[key] === "function" && key !== "init" && key !== "new") {
      Type.prototype[key] = blueprint[key];
    }
  }

  return Type;
}
