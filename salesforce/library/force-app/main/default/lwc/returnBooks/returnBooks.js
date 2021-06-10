import { LightningElement, track } from 'lwc';
import getUserBorrowedBooks from '@salesforce/apex/LibrarySearch.getUserBorrowedBooks';
import returnBooks from '@salesforce/apex/LibrarySearch.returnBooks';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';

export default class ReturnBooks extends LightningElement {
    
    @track listOfBorrowedBooks;
    //@track columns;
    bookSelectedForReturn;
    books;
    
    error;
    
    //fieldName must match names in apex method when creating new bbi
    columns=[
        {label:'Borrow Information Id', fieldName: 'Id', type:'text'},
        {label:'Book Id', fieldName: 'Book__c', type:'text'},
        {label:'Book Title', fieldName: 'Name', type:'text'},
        {label:'Book Status', fieldName:'Status__c', type:'picklist'},
        {label:'Issued Date', fieldName:'Issued_Date__c', type:'date'},
        {label:'Returned Date', fieldName:'Returned_Date__c', type:'date'},
        {label:'Borrow Active', fieldName:'IsBorrowActive__c', type:'text'},
    ];
   
    connectedCallback(){
        console.log(Id);
        this.borrowedBooksList();
        
        console.log('Hello');
        console.log(Id);
        console.log('WHy');
    }

    borrowedBooksList(){
        //call apex method
        getUserBorrowedBooks({currentUser: Id})
       
            .then((result)=> {
                console.log(Id);
                console.log(result);
                this.listOfBorrowedBooks = result;
                let preparedAssets = [];
                this.listOfBorrowedBooks.forEach(asset => {
                    let preparedAsset = {};
                    console.log('Borrow ID'+asset.Id);
                    preparedAsset.Id = asset.Id;
                    preparedAsset.Book__c = asset.Book__r.Id;
                    preparedAsset.Name = asset.Book__r.Name;
                    preparedAsset.Status__c = asset.Book__r.Status__c;
                    console.log('Issued Date'+asset.Issued_Date__c);
                    preparedAsset.Issued_Date__c = asset.Issued_Date__c;
                    preparedAsset.Returned_Date__c = asset.Returned_Date__c;
                    preparedAsset.IsBorrowActive__c = asset.IsBorrowActive__c;
                    //push flattened data into preparedAssets array
                    preparedAssets.push(preparedAsset);
                    window.console.log(preparedAssets);
                });
                //assign flatted data to listOfBorrowedBooks variable
                this.listOfBorrowedBooks = preparedAssets;
                this.error=undefined;
                console.log(preparedAssets);
            })
            .catch((error)=>{
                this.error = error;
                this.listOfBorrowedBooks=undefined;
            });
    
    }
    //function to handle selected rows
    getSelectedRows(event){
        this.bookSelectedForReturn = event.detail.selectedRows;
        console.log(this.bookSelectedForReturn);
        // for(i=0;i < this.bookSelectedForReturn.length; i++){
        //     console.log(this.bookSelectedForReturn[i].Name);
        // }
        
    }
    //when return button is selected
    handleReturn(){
        console.log('Current user extracted: '+Id);
        console.log(this.bookSelectedForReturn);
        
        returnBooks({returnedBooks: this.bookSelectedForReturn})
            .then((result) =>{
                
                this.error = undefined;
                
                console.log('success');
                const toast = new ShowToastEvent({
                    title: result,
                    message: 'Book Returned Successfully',
                    variant: 'success',
                });
                this.dispatchEvent(toast);
                //refresh book list page
                console.log('calling borrowedBooksList method');
                this.borrowedBooksList();
            })
            .catch(error=>{
                console.log('something went wrong');
                this.error = error;
                // const toast2 = new ShowToastEvent({
                //     title: 'Fail',
                //     message: 'Book Returned Successfully',
                //     variant: 'success',
                // });
                // this.dispatchEvent(toast2);
        });
    }
    
}