import { useState, useEffect, useMemo } from 'react';



const getRecords = () => (
    fetch('http://localhost:5000')
        .then(response => response.json())
        .then(data => data)
)

const useSortableData = (config = null) => {
    const [sortConfig, setSortConfig] = useState(config);
    const [record, setRecord] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false);

    useEffect(() => {
        getRecords()
            .then(data =>
                setRecord(data))
        setApiLoaded(true)
    }, []);

    const sortedItems = useMemo(() => {
        let sortableItems = [...record];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [record, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { record: sortedItems, requestSort, sortConfig, apiLoaded };
};

export default useSortableData;