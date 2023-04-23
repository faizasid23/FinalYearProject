// Reusing the router methods

/***************************************************************************************
*    Title: How to use withRouter HOC in React Router v6 with Typescript
*    Author: Iva Kop
*    Date: 2022
*    Code version: 2.0
*    Availability: https://whereisthemouse.com/how-to-use-withrouter-hoc-in-react-router-v6-with-typescript
*
***************************************************************************************/
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                location={location}
                history={navigate}
                params={params}
            />
        );
    }

    return ComponentWithRouterProp;
}
