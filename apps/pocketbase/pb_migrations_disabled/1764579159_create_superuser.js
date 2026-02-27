/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const encryptionKey = $os.getenv("PB_ENCRYPTION_KEY")
    
    const emailEncrypted = $os.getenv("PB_SUPERUSER_EMAIL")
    const passwordEncrypted = $os.getenv("PB_SUPERUSER_PASSWORD")

    const email = $security.decrypt(emailEncrypted, encryptionKey)
    const password = $security.decrypt(passwordEncrypted, encryptionKey)
    
    const superusers = app.findCollectionByNameOrId("_superusers")
    const record = new Record(superusers)
    
    record.set("email", email)
    record.set("password", password)
    
    app.save(record)
})
