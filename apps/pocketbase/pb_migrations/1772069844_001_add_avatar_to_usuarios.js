/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  
  collection.fields.add(new FileField({
    name: "avatar",
    required: false,
    maxSelect: 1,
    maxSize: 20971520
  }));
  
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  collection.fields.removeByName("avatar");
  return app.save(collection);
})
