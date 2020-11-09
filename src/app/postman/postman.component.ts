import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

interface StorageDataModel {
  requestType: string;
  requestText: string;
}

@Component({
  selector: 'app-postman',
  templateUrl: './postman.component.html',
  styleUrls: ['./postman.component.scss']
})
export class PostmanComponent implements OnInit {
  requestForm = new FormGroup({
    requestType: new FormControl(),
    requestText: new FormControl()
  });
  history: StorageDataModel[] ;

  constructor() {}

  getStorageData(): void {
    this.history = JSON.parse(localStorage.getItem('fullStorage'));
    console.log(this.history);
  }

  refreshStorageData(): void {
    const request = {
      requestType: this.requestForm.controls.requestType.value,
      requestText: this.requestForm.controls.requestText.value,
    } as StorageDataModel;

    const storage = JSON.parse(localStorage.getItem('fullStorage')) as StorageDataModel[] || [] as StorageDataModel[];
    storage.push(request);

    localStorage.setItem('fullStorage', JSON.stringify(storage));

    this.getStorageData();
  }

  ngOnInit(): void {
    this.getStorageData();
  }

  buttonClicked(): void {
    this.refreshStorageData();
  }

}
