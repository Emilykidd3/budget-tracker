let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.online) {
        uploadTransaction();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const objectStore = transaction.objectStore('new_transaction');
    objectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const objectStore = transaction.objectStore('new_transaction');
    const getAll = objectStore.getAll();
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse.message);
                    }
                    const transaction = db.transaction(['new_transaction'], 'readwrite');
                    const objectStore = transaction.objectStore('new_transaction');
                    objectStore.clear();

                    alert('All transactions have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

window.addEventListener('online', uploadTransaction);