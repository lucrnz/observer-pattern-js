/**
 * @abstract
 */
class AbstractMessage {
  constructor() {
    if (new.target === AbstractMessage) {
      throw new TypeError(
        "Cannot construct AbstractMessage instances directly",
      );
    }
  }

  /**
   * @abstract
   * @returns {Record<string, unknown>}
   */
  get payload() {
    throw new Error("Not implemented");
  }
}

/**
 * @abstract
 */
class AbstractListener {
  constructor() {
    if (new.target === AbstractListener) {
      throw new TypeError(
        "Cannot construct AbstractListener instances directly",
      );
    }
  }

  /**
   * @abstract
   * @params {AbstractMessage} message
   * @returns {Promise<void>}
   */
  async update(message) {
    throw new Error("Not implemented");
  }

  /**
   * @abstract
   * @returns {string}
   */
  get id() {
    throw new Error("Not implemented");
  }
}

/**
 * @abstract
 */
class AbstractPublisher {
  constructor() {
    if (new.target === AbstractPublisher) {
      throw new TypeError(
        "Cannot construct AbstractPublisher instances directly",
      );
    }
  }

  /**
   * @abstract
   * @param {AbstractListener} listener
   * @returns {Promise<void>}
   */
  async addListener(listener) {
    if (!(listener instanceof AbstractListener)) {
      throw TypeError("listener must be an AbstractListener");
    }
    throw new Error("Not implemented");
  }

  /**
   * @abstract
   * @param {AbstractListener} listener
   * @returns {Promise<void>}
   */
  async removeListener(listener) {
    if (!(listener instanceof AbstractListener)) {
      throw TypeError("listener must be an AbstractListener");
    }
    throw new Error("Not implemented");
  }

  /**
   * @abstract
   * @param {AbstractMessage} message
   * @returns {Promise<void>}
   */
  async notifyListeners(message) {
    if (!(message instanceof AbstractMessage)) {
      throw TypeError("message must be an AbstractMessage");
    }
    throw new Error("Not implemented");
  }
}

class Publisher extends AbstractPublisher {
  /**
   * @type {Set<AbstractListener>}
   */
  #listeners = new Set();

  /**
   * @param {AbstractListener} listener
   * @returns {Promise<void>}
   */
  async addListener(listener) {
    console.log("addListener", listener.id);
    this.#listeners.add(listener);
  }

  /**
   * @param {AbstractListener} listener
   * @returns {Promise<void>}
   */
  async removeListener(listener) {
    console.log("removeListener", listener.id);
    for (const l of this.#listeners) {
      if (l.id === listener.id) {
        this.#listeners.delete(l);
        break;
      }
    }
    throw new Error("Listener not found");
  }

  /**
   * @param {AbstractMessage} message
   * @returns {Promise<void>}
   */
  async notifyListeners(message) {
    for (const l of this.#listeners) {
      await l.update(message);
    }
  }
}

class Listener extends AbstractListener {
  /**
   * @type {string}
   */
  #id;

  /**
   * @param {string} id
   */
  constructor(id) {
    super();
    this.#id = id;
  }

  /**
   * @returns {string}
   * @override
   */
  get id() {
    return this.#id;
  }

  /**
   * @param {AbstractMessage} message
   * @returns {Promise<void>}
   * @override
   */
  async update(message) {
    console.log("update", message.payload);
    console.log("to listener", this.#id);
  }
}

class Message extends AbstractMessage {
  /**
   * @type {string}
   */
  #subject;
  /**
   * @type {string}
   */
  #content;

  /**
   * @param {string} subject
   * @param {string} content
   */
  constructor(subject, content) {
    super();
    this.#subject = subject;
    this.#content = content;
  }

  get payload() {
    return {
      subject: this.#subject,
      content: this.#content,
    };
  }
}

// Example usage:
const publisher = new Publisher();

const listenerA = new Listener("Alice");
const listenerB = new Listener("Bob");

publisher.addListener(listenerA);
publisher.addListener(listenerB);

const message = new Message(
  "Mailing list update",
  "Welcome to all members!\nThis is the mailing list.\nPlease try our new product, you can find it at https://example.com.\nGreetings!",
);

publisher.notifyListeners(message);
