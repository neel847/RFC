import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const Home = () => {
    const [currencyPair, setCurrencyPair] = useState("EUR/USD");
    const [accountSize, setAccountSize] = useState("");
    const [riskRatio, setRiskRatio] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [liveBalance, setLiveBalance] = useState("");
    const [liveRisk, setLiveRisk] = useState("");
    const [result, setResult] = useState(null); // For showing the result

    const handleCalculate = async () => {
        if(!accountSize || !liveBalance || !riskRatio || !liveRisk || !stopLoss){
            toast.error("All fields are required");
            return;
        }
        const data = {
            challenge_balance: parseFloat(accountSize),
            live_balance: parseFloat(liveBalance),
            challenge_risk: parseFloat(riskRatio),
            live_risk: parseFloat(liveRisk),
            stop_loss: parseFloat(stopLoss),
            currency_pair: currencyPair,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();
            setResult(resultData);
        } catch (error) {
            console.error("Error calculating:", error);
        }
    };

    const handleReset = () => {
        setCurrencyPair("EUR/USD");
        setAccountSize("");
        setRiskRatio("");
        setStopLoss("");
        setLiveBalance("");
        setLiveRisk("");
        setResult(null);
    };

    return (
        <div>
        <Toaster />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-bold text-center mb-6">Position Size Calculator</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Currency Pair:</label>
                            <select
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                value={currencyPair}
                                onChange={(e) => setCurrencyPair(e.target.value)}
                            >
                                <option value="EUR/USD">EUR/USD</option>
                                <option value="GBP/USD">GBP/USD</option>
                                <option value="USD/JPY">USD/JPY</option>
                                <option value="EUR/JPY">EUR/JPY</option>
                            </select>
                        </div>

                        <div className='flex justify-between gap-x-4'>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Challenge Balance:</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    value={accountSize}
                                    onChange={(e) => setAccountSize(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Live Balance:</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    value={liveBalance}
                                    onChange={(e) => setLiveBalance(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='flex justify-between gap-x-4'>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Challenge Risk (%):</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    value={riskRatio}
                                    onChange={(e) => setRiskRatio(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Live Risk (%):</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    value={liveRisk}
                                    onChange={(e) => setLiveRisk(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Stop-Loss (Pips):</label>
                            <input
                                type="number"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                value={stopLoss}
                                onChange={(e) => setStopLoss(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between space-x-2">
                            <button
                                className="w-full py-2 bg-gray-300 text-gray-700 font-bold rounded hover:bg-gray-400"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                            <button
                                className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                                onClick={handleCalculate}
                            >
                                Calculate
                            </button>
                        </div>
                    </div>

                    {/* Display the result */}
                    {result && (
                        <div className="mt-6 p-4 bg-gray-50 shadow-sm rounded">
                            <h2 className="text-lg font-bold">Result:</h2>
                            <table>
                                <tr>
                                    <td>Challenge Risk Amount: <span className='font-semibold'>{result.challenge_risk_amount}</span></td>
                                    <td className='pl-12'>Live Risk Amount: <span className='font-semibold'>{result.live_risk_amount}</span></td>
                                </tr>
                                <tr>
                                    <td>Challenge Lot Size: <span className='font-semibold'>{result.challenge_lot_size}</span></td>
                                    <td className='pl-12'>Live Lot Size: <span className='font-semibold'>{result.live_lot_size}</span></td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Pip Value: {result.pip_value}</td>
                                </tr>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
