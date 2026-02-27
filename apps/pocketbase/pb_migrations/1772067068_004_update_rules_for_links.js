/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("links");
  collection.viewRule = "usuario_id = @request.auth.id || usuario_id.status = 1";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("links");
  collection.viewRule = "usuario_id = @request.auth.id";
  return app.save(collection);
})
