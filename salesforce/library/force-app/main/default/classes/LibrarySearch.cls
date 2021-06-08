public with sharing class LibrarySearch {
    
    @AuraEnabled(cacheable=true)
    public static list<Book_Borrow_Information__c> getBookList(String searchKey) {
        
        string searchKeyword = '%' + searchKey + '%';
        
        //List to store book records
        list<Book_Borrow_Information__c> bookInfoRecords = new list<Book_Borrow_Information__c>();

        
        for(Book_Borrow_Information__c bookInfo : 
            [Select book__r.Name, book__r.Author__c, Issued_Date__c 
            from Book_Borrow_Information__c 
            where user__r.id__c LIKE :searchKeyword
            AND (book__r.status__c = 'OVERDUE' OR book__r.status__c = 'BORROWED')]){
                bookInfoRecords.add(bookInfo);
        }
        
        //handle no search results
        if(bookInfoRecords.size() == 0){
            throw new AuraHandledException('No record found..');
        }
        
        //return bookInfoRecordsList
        return bookInfoRecords;
      
    }
    @AuraEnabled(cacheable=true)
    public static list<Book__c> getBooksByName(string searchKey){
        
        string searchKeyword = '%' + searchKey + '%';

        //List to store book info
        list<Book__c> bookInfoRecords = new list<Book__c>();

        for(Book__c bookInfo : 
        [Select Name, status__c from Book__c where Name LIKE :searchKeyword]){
        //[Select book__r.Name, book__r.status__c from Book_Borrow_Information__c]){
            bookInfoRecords.add(bookInfo);
        }
        //handle no search results
        if(bookInfoRecords.size() == 0){
            throw new AuraHandledException('No records found..');
        }
        //return bookInfoRecords List
        return bookInfoRecords;
    }

    @AuraEnabled
    public static list<Book__c> searchBooks(string searchKey, string searchType){
        try {
            //create a search query with passed in parameters
            String query = 'Select Id__c, Name, Author__c, Status__c from Book__c where '+searchType+' LIKE '+'\''+'%'+searchKey+'%'+'\'';

            //pass results into a list
            List<Book__c> listOfBooks = Database.query(query);
            
            //return list
            return listOfBooks;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

