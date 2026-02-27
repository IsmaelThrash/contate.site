/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  collection.indexes.push("CREATE UNIQUE INDEX idx_usuarios_slug ON usuarios (slug)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_usuarios_slug"));
  return app.save(collection);
})
