Datalayer for angular2
======================

This project provides the foundations to build collections of data objects from a REST API.
 

- Each collection is identified by an identifier (ex: `/api/v1/trains`)
- Each object is identified by an identifier (ex: `/api/v1/trains/32`)
- An object is part of a collection (a `Train` is par of `TrainCollection`)
- A collection can be a subresource of another collection (`WagonCollection` is a subresource of train as in
 `/api/v1/trains/32/wagons`)
 
 
 - An object identifier is a dict of properties + a context (multiple protocols)
 - Subresources inherit parent properties and context (parent inheritance)
 - Objects and collections can be cached / stored locally (persistence layer)
 
 
 ## REST backend
 
 ```
 @Dataobject(
    
 )
 class Train extends Dataobject {
    public id: number;
    public name: string;
 }

 @Collection(
    base: Train
 }
 class TrainCollection extends Datacollection<Train> {
 }
 
 @Injectable()
 class TrainService extends Dataservice<Train> {
    constructor(collection: TrainCollection,
                adapter: AdapterService,
                backend: BackendService,
                persistence: PersistenceService) {
    }
 }
 
 
 # Usage
 
 @Component({
    providers: [TrainCollectionService]
 }
 class MyComponent implements OnInit {
     constructor(private _trainc: TrainCollectionService) {
     }
     
     public ngOnInit(): void {
        this.trainc = new this._trains();
        this.trains.getList({filter: {maxlen: 12}}).subscribe((trains) => {
        });
     }
 ```
 
 
 
 
 
 
 

