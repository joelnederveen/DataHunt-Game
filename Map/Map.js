import JsonLoader from "../Core/Loaders/JsonLoader.js"
import Tileset from "../Core/Tileset.js";
import Event from "../Core/Event.js";
import Sprite from "../Core/Drawables/Sprite.js";
import Vector2 from "../Core/Vector2.js";
import GameObject from "../Core/GameObject.js";
import Rectangle from "../Core/Drawables/Rectangle.js";

export default class Map {
    constructor() {
        
    }

    static async Load(pathToMainJsonFile){
        return new Promise(async (resolve, reject) => {
            let event = new Event()
            let jsonData = await JsonLoader.Load(pathToMainJsonFile)
            let allTiles = new Array()
            let totalTiles = 0
            //Safety check, sets the amount of tiles
            jsonData.tilesets.map(async t => {
                let tilesetData = await JsonLoader.Load(`./Map/${t.source}`)
                totalTiles += tilesetData.tilecount
            })
            jsonData.tilesets.map(async t => {
                let tilesetData = await JsonLoader.Load(`./Map/${t.source}`)
                tilesetData.offset = t.firstgid
                let tiles = await Tileset.Load(tilesetData)
                allTiles = tiles.concat(allTiles)
                //Check required, so it continues when all the tiles are loaded
                if(totalTiles == allTiles.length){
                    event.Trigger('loaded tilesets')
                }
            });
            event.On('loaded tilesets', () => {
                let map = []
                let gameObjects = []
                jsonData.layers.map(async l => {
                    switch (l.type) {
                        case "objectgroup":
                            l.objects.forEach(object => {
                                let gameObject = new GameObject(new Rectangle(new Vector2(object.x * window.spriteScaleFactor, object.y * window.spriteScaleFactor), new Vector2(object.width * window.spriteScaleFactor, object.height * window.spriteScaleFactor)));
                                gameObject.rotation = object.rotation
                                gameObject.type = object.type
                                gameObjects.push(gameObject)
                            });
                            //TODO add gameobjects to return data
                            break;
                        case "tilelayer":
                            for (let y = 0; y < l.height; y++) {
                                for (let x = 0; x < l.width; x++) {
                                    let tileIndex = l.data[y * l.height + x]
                                    if(tileIndex - 1 > -1){
                                        let tile = allTiles.find(t => {
                                            return t.index == tileIndex - 1
                                        })
                                        let img = tile.tile
                                        let tilePos = new Vector2(x * img.width * window.spriteScaleFactor, y * img.height * window.spriteScaleFactor)
                                        let tileSize = new Vector2(img.width * window.spriteScaleFactor, img.height * window.spriteScaleFactor)
                                        let sprite = new Sprite(tilePos, tileSize, img.src)
                                        sprite.animation = tile.animation
                                        let gameObject = new GameObject(sprite)
                                        gameObject.type = tile.type
                                        map.push(gameObject)
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                })
                return resolve(map)
            })
        })
    }
}