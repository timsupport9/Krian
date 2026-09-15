export default class Container {
  constructor() {
    this.bindings = new Map();
    this.singletons = new Map();
  }

  bind(name, resolver) {
    this.bindings.set(name, resolver);
    return this;
  }

  singleton(name, resolver) {
    if (typeof resolver === 'function') {
      this.bindings.set(name, resolver);
      this.singletons.set(name, null);
    } else {
      this.singletons.set(name, resolver);
    }
    return this;
  }

  make(name, ...params) {
    if (this.singletons.has(name)) {
      let instance = this.singletons.get(name);
      if (instance === null && this.bindings.has(name)) {
        const resolver = this.bindings.get(name);
        instance = typeof resolver === 'function' ? resolver(this, ...params) : resolver;
        this.singletons.set(name, instance);
      }
      return instance;
    }

    if (this.bindings.has(name)) {
      const resolver = this.bindings.get(name);
      return typeof resolver === 'function' ? resolver(this, ...params) : resolver;
    }

    throw new Error(`Service "${name}" not found in container`);
  }

  has(name) {
    return this.bindings.has(name) || this.singletons.has(name);
  }
}
