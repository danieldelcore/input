export function detectTrigger(eventKey, triggers) {
    const triggerMap = typeof triggers === 'string' ? [triggers] : triggers;

    return triggerMap.find(trigger => eventKey === trigger);
}
