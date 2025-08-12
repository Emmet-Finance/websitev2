
export default function PricesTable() {
    return (<table 
    style={{ "border": "1", "width": "100%", "borderCollapse": "collapse" }}
    className="tokensale-table"
    >
        <thead >
            <tr>
                <th>USDT Amount</th>
                <th>EMMET Price $</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>20 - 999</td>
                <td>0.0125</td>
            </tr>
            <tr>
                <td>1,000 - 5,000</td>
                <td>0.00122</td>
            </tr>
            <tr>
                <td>5,000 - 19,999</td>
                <td>0.00121</td>
            </tr>
            <tr>
                <td>20,000 - 49,999</td>
                <td>0.012</td>
            </tr>
            <tr>
                <td>50,000 - 99,000</td>
                <td>0.00118</td>
            </tr>
            <tr>
                <td>100,000 +</td>
                <td>0.0115</td>
            </tr>
        </tbody>
    </table>)
}