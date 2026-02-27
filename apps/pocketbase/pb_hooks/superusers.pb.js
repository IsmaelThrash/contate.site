
/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
    const { ALLOWED_IPS } = require(`${__hooks}/superusers-allow-list.js`)
    const ip = e.realIP()
    
    if (!ALLOWED_IPS.includes(ip)) {
        throw new BadRequestError(`Not allowed to create superuser`)
    }
    
    e.next()
}, "_superusers")

onRecordUpdateRequest((e) => {
    const { ALLOWED_IPS } = require(`${__hooks}/superusers-allow-list.js`)
    const ip = e.realIP()
    
    if (!ALLOWED_IPS.includes(ip)) {
        throw new BadRequestError(`Not allowed to update superuser`)
    }
    
    e.next()
}, "_superusers")

onRecordDeleteRequest((e) => {
    const { ALLOWED_IPS } = require(`${__hooks}/superusers-allow-list.js`)
    const ip = e.realIP()
    
    if (!ALLOWED_IPS.includes(ip)) {
        throw new BadRequestError(`Not allowed to delete superuser`)
    }

    e.next()
}, "_superusers")

onCollectionUpdateRequest((e) => {
    if (e.collection.name !== "_superusers") {
        e.next()
        return
    }

    const { ALLOWED_IPS } = require(`${__hooks}/superusers-allow-list.js`)
    const ip = e.realIP()
    
    if (!ALLOWED_IPS.includes(ip)) {
        throw new BadRequestError(`Not allowed to update collection`)
    }

    e.next()
})
