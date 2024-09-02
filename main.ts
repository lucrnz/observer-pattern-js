abstract class AbstractMessage<T> {
  constructor() {
    if (new.target === AbstractMessage) {
      throw new TypeError(
        "Cannot construct AbstractMessage instances directly",
      );
    }
  }

  abstract get payload(): T;
}

abstract class AbstractListener<T> {
  constructor() {
    if (new.target === AbstractListener) {
      throw new TypeError(
        "Cannot construct AbstractListener instances directly",
      );
    }
  }

  abstract update(message: AbstractMessage<T>): Promise<void>;
  abstract get id(): string;
}

abstract class AbstractPublisher<T> {
  constructor() {
    if (new.target === AbstractPublisher) {
      throw new TypeError(
        "Cannot construct AbstractPublisher instances directly",
      );
    }
  }

  abstract addListener(listener: AbstractListener<T>): Promise<void>;
  abstract removeListener(listener: AbstractListener<T>): Promise<void>;
  abstract notifyListeners(message: AbstractMessage<T>): Promise<void>;
}

class Publisher<T> extends AbstractPublisher<T> {
  private listeners: Set<AbstractListener<T>> = new Set();

  async addListener(listener: AbstractListener<T>): Promise<void> {
    console.log("addListener", listener.id);
    this.listeners.add(listener);
  }

  async removeListener(listener: AbstractListener<T>): Promise<void> {
    console.log("removeListener", listener.id);
    for (const l of this.listeners) {
      if (l.id === listener.id) {
        this.listeners.delete(l);
        break;
      }
    }
    throw new Error("Listener not found");
  }

  async notifyListeners(message: AbstractMessage<T>): Promise<void> {
    for (const listener of this.listeners) {
      await listener.update(message);
    }
  }
}

// Implementation of the Listener
class Listener<T> extends AbstractListener<T> {
  private readonly _id: string;

  constructor(id: string) {
    super();
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  async update(message: AbstractMessage<T>): Promise<void> {
    console.log("update", message.payload);
    console.log("to listener", this._id);
  }
}

type MessagePayload = { subject: string; content: string };

class Message extends AbstractMessage<MessagePayload> {
  private readonly _payload: MessagePayload;

  constructor(payload: MessagePayload) {
    super();
    this._payload = payload;
  }

  get payload(): MessagePayload {
    return this._payload;
  }
}

// Example usage:
const publisher = new Publisher<MessagePayload>();

const listenerA = new Listener("Alice");
const listenerB = new Listener("Bob");

publisher.addListener(listenerA);
publisher.addListener(listenerB);

const message = new Message({
  subject: "Mailing list update",
  content:
    "Welcome to all members!\nThis is the mailing list.\nPlease try our new product, you can find it at https://example.com.\nGreetings!",
});

publisher.notifyListeners(message);
