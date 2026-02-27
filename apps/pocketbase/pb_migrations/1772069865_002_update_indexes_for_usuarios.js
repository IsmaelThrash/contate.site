/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  // No index operations
  return app.save(collection);
}, (app) => {
  // Note: removed_index_definitions not provided — cannot restore removed indexes
})
