const BATCH_SIZE_PER_CLASS = 4;
const BASE_URL_BACKEND = "http://localhost:8000/"

async function updateDatabase() {
    const updateURL = BASE_URL_BACKEND + "mainapp/updatedoc/";
    var requestOptions = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "document_id" : document_id,
            "reviewed_label_name" : label
        })
    }
    await fetch(updateURL, requestOptions);
}

class DocumentQueue {
    static que = [];
    static label_a = 0;
    static label_b = 0;
    static label_c = 0;
    static label_d = 0;

    static check() {
        if( DocumentQueue.label_a < BATCH_SIZE_PER_CLASS ) return false;
        if( DocumentQueue.label_b < BATCH_SIZE_PER_CLASS ) return false;
        if( DocumentQueue.label_c < BATCH_SIZE_PER_CLASS ) return false;
        if( DocumentQueue.label_d < BATCH_SIZE_PER_CLASS ) return false;
        return true;
    }

    static addDoc( document, label ) {
        DocumentQueue.que.push( document, label );
        if( DocumentQueue.check() ) {
            DocumentQueue.que.clear();
        }
    }
}

export default DocumentQueue;