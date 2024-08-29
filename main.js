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
   * @returns Promise<void>
   */
  async notify() {
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
}
