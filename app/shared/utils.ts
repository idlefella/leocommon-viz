/**
 * Creates a histogram from a list of floats.
 * @param {number[]} data - The list of floats.
 * @param {number} numBuckets - The number of buckets (bins) to create.
 * @param {number} [minValue] - Optional minimum value for the range.
 * @param {number} [maxValue] - Optional maximum value for the range.
 * @returns {Object} An object with `buckets` (array of bucket ranges) and `counts` (array of counts per bucket).
 */
export function createHistogram(data, numBuckets, minValue = null, maxValue = null) {
    if (data.length === 0) return { buckets: [], counts: [] };

    // Calculate min and max if not provided
    const min = minValue !== null ? minValue : Math.min(...data);
    const max = maxValue !== null ? maxValue : Math.max(...data);

    // Handle case where all values are the same
    if (min === max) {
        return {
            buckets: [[min, max]],
            counts: [data.length]
        };
    }

    const bucketSize = (max - min) / numBuckets;
    const buckets = [];
    const counts = new Array(numBuckets).fill(0);

    // Initialize bucket ranges
    for (let i = 0; i < numBuckets; i++) {
        const lower = min + i * bucketSize;
        const upper = min + (i + 1) * bucketSize;
        buckets.push([lower, upper]);
    }

    // Distribute data into buckets
    data.forEach(value => {
        let index = Math.floor((value - min) / bucketSize);
        // Handle edge case where value is exactly max
        if (index >= numBuckets) index = numBuckets - 1;
        counts[index]++;
    });

    return { buckets, counts };
}

// Example usage:
//const data = [1.2, 3.4, 2.1, 5.6, 4.3, 3.2, 6.7, 5.5, 4.4, 3.3];
//const histogram = createHistogram(data, 5);
//console.log(histogram);

export function aggregateData(data, interval) {
    const aggregatedData = {};
  
    data.forEach(item => {
        const timeBucket = Math.floor(item.time / interval) * interval;
      
        if (!aggregatedData[timeBucket]) {
            aggregatedData[timeBucket] = {
                time: timeBucket,
                snrValues: [],
            };
        }
      
        aggregatedData[timeBucket].snrValues.push(item.snr);
    });

    return Object.values(aggregatedData).map(bucket => {
        const snrValues = bucket.snrValues;
        snrValues.sort((a, b) => a - b);

        const snrMin = snrValues[0];
        const snrMax = snrValues[snrValues.length - 1];
        const snrAvg = snrValues.reduce((sum, value) => sum + value, 0) / snrValues.length;
        const snrMedian = snrValues.length % 2 === 0 ? 
            (snrValues[snrValues.length / 2 - 1] + snrValues[snrValues.length / 2]) / 2 :
            snrValues[Math.floor(snrValues.length / 2)];
      
        return {
            time: bucket.time,
            snr_min: snrMin,
            snr_max: snrMax,
            snr_median: snrMedian,
            snr_avg: snrAvg
        };
    });
}