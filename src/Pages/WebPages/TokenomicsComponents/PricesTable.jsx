
export default function PricesTable() {
    return (<table style={{ "border": "1", "width": "100%", "borderCollapse": "collapse" }}>
        <thead >
            <tr>
                <th>USDT Amount</th>
                <th>EMMET Price $</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>20 - 999</td>
                <td>0.0100</td>
            </tr>
            <tr>
                <td>1,000 - 5,000</td>
                <td>0.0098</td>
            </tr>
            <tr>
                <td>5,000 - 19,999</td>
                <td>0.0097</td>
            </tr>
            <tr>
                <td>20,000 - 49,999</td>
                <td>0.0095</td>
            </tr>
            <tr>
                <td>50,000 - 99,000</td>
                <td>0.0092</td>
            </tr>
            <tr>
                <td>100,000 +</td>
                <td>0.0090</td>
            </tr>
        </tbody>
    </table>)
}