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
   identifier: http://{SERVER_URL}/api/v1/trains/{id}?{FIELDS}
   validation: JSONSchemaObject
)
class Train extends Dataobject {
   public id: number;
   public name: string;
}

@Collection({
    base: Train,
    identifier: "http://{SERVER_URL}/api/v1/trains?{FIELDS}&{PAGINATION}&{SORT}" 
    pagination: 
})
class TrainCollection extends Datacollection<Train> {
    constructor(public name: string) {}
    public getWagons(this.

}


@Injectable()
class TrainService extends Dataservice<Train> {
   constructor(datacontext: ContextService,
               collection: TrainCollection,
               adapter: RestAdapterService,
               backend: RestBackendService,
               register: CollectionService,
               persistence: MemoryPersistenceService) {
   }
}


# Usage

@Component({
   providers: [TrainCollectionService]
}
class MyComponent implements OnInit {
    constructor(private Trains: TrainService) {
    }
    
    public ngOnInit(): void {
       this.trainc = this.Trains.collection();
       this.trainc.setFilter({details: 1});
       this.trainc.setParams({page_size: 12});
       this.trains = this.trainc.getList().subscribe((trains) => {
       });
    }
```

    public onSubmit(traindata: any): void {
        let train: Train = this.trainc.create(traindata);
        if (train.validate()) {
            train.save().subscribe((savedtrain) => {
                console.log(train.id === savedtrain.id);
            });
        }
    }
    
    public onUpdate(): void {
        let sub: Subscription = this.trainc.getList()
            .filter((train) => train.id === 12)
            .subscribe((trainslist) => {
                console.log("Collection updated",
                            trainslist[0].name === "ROMY");
                sub.unsubscribe();
             });
        let updatedtrain: Train = this.trainc.get(12);
        updatedtrain.name = "ROMY"
        updatedtrain.save().subscribe((savedtrain) => {
            console.log(updatedtrain.name === savedtrain.name);
        });
    }
 }
 
 
 




