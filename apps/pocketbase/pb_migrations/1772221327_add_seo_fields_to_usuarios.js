/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");

  collection.fields.add(new TextField({
    "name": "nome_exibicao",
    "presentable": true
  }));

  collection.fields.add(new TextField({
    "name": "bio"
  }));

  collection.fields.add(new TextField({
    "name": "meta_titulo"
  }));

  collection.fields.add(new TextField({
    "name": "meta_descricao"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");

  collection.fields.removeByName("nome_exibicao");
  collection.fields.removeByName("bio");
  collection.fields.removeByName("meta_titulo");
  collection.fields.removeByName("meta_descricao");

  return app.save(collection);
})
