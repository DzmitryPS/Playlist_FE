import { useState, useEffect, useMemo, useCallback } from 'react';
import records from './records';
import { useLazyLoading } from "./useLazyLoading";

//Закоменченый код используем при работе с нашей API. Для имитации БД создал records.js

// const getRecords = () => (
//     fetch('http://localhost:5000')
//         .then(response => response.json())
//         .then(data => data)
// )

const useSortableData = (config = null) => {
    const [sortConfig, setSortConfig] = useState(config);
    const [record, setRecord] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false);

    const appendItems = useCallback(() => {
        setRecord([
            ...records.slice(0, 20)
        ]);
    }, [setRecord]);

    const [onScroll, containerRef] = useLazyLoading({
        onIntersection: appendItems,
        delay: 1200
    });

    useEffect(() => {
        // getRecords()
        //     .then(data =>
        setRecord(records.slice(0, 10))
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

    return { record: sortedItems, requestSort, sortConfig, apiLoaded, onScroll, containerRef };
};

export default useSortableData;