import { LightningElement } from 'lwc';

export default class SearchBooks2 extends LightningElement {
    
    searchType='Name';

    columns=[
        {label: 'Id', fieldName: 'Id__c'},
        {label: 'Name', fieldName: 'Name'},
        {label: 'Author', fieldName: 'Author__c'},
        {label: 'Status', fieldName: 'Status__c'},
    ];

    get options() {
        return [
            { label: 'Id', value: 'Id__c' },
            { label: 'Name', value: 'Name' },
            { label: 'Author', value: 'Author__c'},
            { label: 'Status', value: 'Status__c'},
        ];
    }

}