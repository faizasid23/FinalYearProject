// Overriding the router methods
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
