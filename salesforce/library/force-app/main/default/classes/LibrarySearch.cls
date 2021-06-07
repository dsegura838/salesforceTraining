public with sharing class LibrarySearch {
    @AuraEnabled(cacheable=true)

    public static list<Book_Borrow_Information__c> getBookList(String searchKey) {
        
        string searchKeyword = '%' + searchKey + '%';

        

        //List to store book records
       
        list<Book_Borrow_Information__c> bookInfoRecords = new list<Book_Borrow_Information__c>();

        
        for(Book_Borrow_Information__c bookInfo : 
            [Select book__r.Name, book__r.Author__c, Issued_Date__c 
            from Book_Borrow_Information__c 
            where user__r.id__c LIKE :searchKeyword]){
                bookInfoRecords.add(bookInfo);
        }
        
        //handle no search results
        if(bookInfoRecords.size() == 0){
            throw new AuraHandledException('No record found..');
        }
        
        //return bookInfoRecordsList
        return bookInfoRecords;
      
    }
}
