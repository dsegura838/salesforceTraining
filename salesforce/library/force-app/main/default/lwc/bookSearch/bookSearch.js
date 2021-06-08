import { LightningElement } from 'lwc';
// import server side apex class method
import getBooksByName from '@salesforce/apex/LibrarySearch.getBooksByName';
//import standard toastEvent
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name'
    }, {
        label: 'Status',
        fieldName: 'Status__c',
    }, 
];

export default class BookSearch extends LightningElement {
    searchData;
    columns = columns;
    errorMsg = '';
    strSearchBookName = '';

    //update searchValue when input field changes
    handleBookName(event){
        this.errorMsg = '';
        this.strSearchBookName = event.target.value;
        console.log(this.strSearchBookName);
       
    }

    handleSearch() {
        if(!this.strSearchBookName) {
            this.errorMsg = 'Please enter Book name to search.';
            this.searchData = undefined;
            return;
        }
    
        getBooksByName({
            searchKey : this.strSearchBookName})
            .then(result => {
                this.searchData = result
            })
            .catch(error =>{
                this.searchData = undefined;
                if(error){
                    if(Array.isArray(error.body)){
                        this.errorMsg = error.body.map(e=>e.message).join(', ');
                    } else if (typeof error.body.message === 'string'){
                        this.errorMsg = error.body.message;
                    }
                }
            })
    // //call apex method on button click
    // handleSearchKeyword(){
    //     if(this.searchValue !== ''){
    //         getBookList({
    //             searchKey : this.searchValue
                
    //         })
    //         .then(result =>{
    //             this.bookRecord = result;
    //             console.log(this.bookRecord);
    //         })
    //         .catch(error =>{
    //             const event = new ShowToastEvent({
    //                 title : 'Error',
    //                 variant : 'error',
    //                 message : error.body.message,
    //             });
    //             this.dispatchEvent(event);


    //             //reset books with null
    //             this.bookRecord = null;
    //         });

    //         console.log(this.searchValue);

    //     }else{
    //         //fire toast event if field is blank
    //         const event = new ShowToastEvent({
    //             variant : 'error',
    //             message : 'search text missing ...',
    //         });
    //         this.dispatchEvent(event);
    //     }
     }
}