import { Component, EventEmitter, OnInit } from "@angular/core";
import { MaterializeAction } from "angular2-materialize";
import { TFHTTPService } from "../../servicos/tf-http.service";


@Component({
    selector: 'u2x-tf-loader',
    templateUrl: './loader.component.html'
})

export class LoaderComponent implements OnInit {

    modalActions = new EventEmitter<MaterializeAction>();
    constructor(private TFHTTPService: TFHTTPService) {
        this.TFHTTPService.isWorking
            .subscribe((isWorking: boolean) => {
                if (isWorking) {
                    this.modalActions.emit({ action: "modal", params: ['open'] });
                } else {
                    this.modalActions.emit({ action: "modal", params: ['close'] });

                }
            })

    }
    ngOnInit() {

    }

}