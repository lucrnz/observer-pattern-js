/**
 * @abstract
 */
class BroadcastedEvent {
  constructor() {
    if (new.target === BroadcastedEvent) {
      throw new TypeError("Cannot construct BroadcastedEvent instances directly");
    }
  }

  /**
   * @abstract
   * @returns {Record<string, unknown>}
   */
  get data() {
    throw new Error("Not implemented");
  }
}

/**
 * @abstract
 */
class NotifiableEntity {
  constructor() {
    if (new.target === NotifiableEntity) {
      throw new TypeError(
        "Cannot construct NotifiableEntity instances directly"
      );
    }
  }

  /**
   * @abstract
   * @params {BroadcastedEvent} event
   * @returns {Promise<void>}
   */
  async notify(event) {
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
class BroadcastEntity {
  constructor() {
    if (new.target === BroadcastEntity) {
      throw new TypeError(
        "Cannot construct BroadcastEntity instances directly"
      );
    }
  }

  /**
   * @abstract
   * @param {NotifiableEntity} subscriber
   * @returns {Promise<void>}
   */
  async subscribe(subscriber) {
    if (!subscriber instanceof NotifiableEntity) {
      throw TypeError("subscriber must be a NotifiableEntity");
    }
    throw new Error("Not implemented");
  }

  /**
   * @abstract
   * @param {NotifiableEntity} subscriber
   * @returns {Promise<void>}
   */
  async unsubscribe(subscriber) {
    if (!subscriber instanceof NotifiableEntity) {
      throw TypeError("subscriber must be a NotifiableEntity");
    }
    throw new Error("Not implemented");
  }

  /**
   * @abstract
   * @param {BroadcastedEvent} event
   * @returns {Promise<void>}
   */
  async broadcast(event) {
    if (!event instanceof BroadcastedEvent) {
      throw TypeError("event must be a BroadcastedEvent");
    }
    throw new Error("Not implemented");
  }
}

class NotifierEntity extends BroadcastEntity {
  #subscribers = new Set();

  /**
   * @param {NotifiableEntity} subscriber
   * @returns {Promise<void>}
   */
  async subscribe(subscriber) {
    console.log("subscribe", subscriber.id);
    this.#subscribers.add(subscriber);
  }

  /**
   * @param {NotifiableEntity} subscriber
   * @returns {Promise<void>}
   */
  async unsubscribe(subscriber) {
    console.log("unsubscribe", subscriber.id);
    const found = false;

    for (const s of this.#subscribers) {
      if (s.id === subscriber.id) {
        this.#subscribers.delete(s);
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error("subscriber not found");
    }
  }

  /**
   * @param {BroadcastedEvent} event
   * @returns {Promise<void>}
   */
  async broadcast(event) {
    for (const s of this.#subscribers) {
      s.notify(event);
    }
  }
}

class User extends NotifiableEntity {
  #id;

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
   * @abstract
   * @param {BroadcastedEvent} event
   * @returns {Promise<void>}
   * @override
   */
  async notify(event) {
    console.log("notify", event.data);
    console.log("to user", this.#id);
  }
}

class EmailEvent extends BroadcastedEvent {
  #subject;
  #body;

  constructor(subject, body) {
    super();
    this.#subject = subject;
    this.#body = body;
  }

  get data() {
    return {
      subject: this.#subject,
      body: this.#body,
    };
  }
}

const ne = new NotifierEntity();

const userA = new User("Alice");
const userB = new User("Bob");

ne.subscribe(userA);
ne.subscribe(userB);

const email = new EmailEvent(
  "Mailing list update",
  "Welcome to all members!\nThis is the mailing list.\nPlease try our new product, you can find it at https://example.com.\nGreetings!"
);

ne.broadcast(email);
