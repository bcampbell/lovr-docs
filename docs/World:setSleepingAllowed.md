<!--
category: reference
-->

World:setSleepingAllowed
===

Sets whether or not colliders in the world can be put to sleep.

    world:setSleepingAllowed(allowed)

### Arguments

- `boolean allowed` Whether or not sleeping is allowed.

### Returns

Nothing

Notes
---

If sleeping is enabled, the world will try to detect colliders that haven't moved for a while and
put them to sleep.  Sleeping colliders don't impact the physics simulation, which makes updates more
efficient and improves physics performance.  However, the physics engine isn't perfect at waking up
sleeping colliders and this can lead to bugs where colliders don't react to forces or collisions
properly.

This can be set on individual colliders.

Colliders can be manually put to sleep or woken up using `Collider:setAwake`.

See also
---

- `World:isSleepingAllowed`
- `Collider:isSleepingAllowed`
- `Collider:setSleepingAllowed`
- `Collider:isAwake`
- `Collider:setAwake`
- `lovr.physics.newWorld`
