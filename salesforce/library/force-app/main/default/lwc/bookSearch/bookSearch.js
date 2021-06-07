import { LightningElement, track } from 'lwc';
// import server side apex class method
import getBooksByName from '@salesforce/apex/LibrarySearch.getBooksByName';
//import standard toastEvent
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BookSearch extends LightningElement {
    @track bookRecord;
    searchValue = '';

    //update searchValue when input field changes
    searchKeyword(event){
        this.searchValue = event.target.value;
       
    }
    //call apex method on button click
    handleSearchKeyword(){
        if(this.searchValue !== ''){
            getBookList({
                searchKey : this.searchValue
                
            })
            .then(result =>{
                this.bookRecord = result;
                console.log(this.bookRecord);
            })
            .catch(error =>{
                const event = new ShowToastEvent({
                    title : 'Error',
                    variant : 'error',
                    message : error.body.message,
                });
                this.dispatchEvent(event);


                //reset books with null
                this.bookRecord = null;
            });

            console.log(this.searchValue);

        }else{
            //fire toast event if field is blank
            const event = new ShowToastEvent({
                variant : 'error',
                message : 'search text missing ...',
            });
            this.dispatchEvent(event);
        }
    }
}