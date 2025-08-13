import { Button, Form, InputGroup, Row, Col } from 'react-bootstrap';

const ApplicationsFilters = ({
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    nationalityFilter,
    setNationalityFilter,
    positionFilter,
    setPositionFilter,
    salaryFilter,
    setSalaryFilter,
    dateFilter,
    setDateFilter,
    nationalities,
    positions,
    handleResetFilters,
    filteredWorkers
}) => {
    return (
        <div className="mb-4 p-3 bg-light rounded border">
            {/* Header con controles principales */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={handleResetFilters}
                    className="d-flex align-items-center gap-2 border-0 text-muted"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <i className="bi bi-arrow-clockwise"></i>
                    Resetear filtros
                </Button>

                <div className="d-flex align-items-center gap-2">
                    <small className="text-muted fw-medium">
                        {filteredWorkers.length} registro{filteredWorkers.length !== 1 ? 's' : ''} encontrado{filteredWorkers.length !== 1 ? 's' : ''}
                    </small>
                </div>
            </div>

            {/* Filtros en grid responsivo */}
            <Row className="g-3 mb-3">
                <Col xs={12} sm={6} md={4} lg={2}>
                    <Form.Label className="small fw-medium text-dark mb-1">Nombre</Form.Label>
                    <Form.Select
                        size="sm"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border-0 bg-white shadow-sm text-muted"
                    >
                        <option value="">Sin ordenar</option>
                        <option value="1">A-Z</option>
                        <option value="1-desc">Z-A</option>
                    </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4} lg={2}>
                    <Form.Label className="small fw-medium text-dark mb-1">Salario</Form.Label>
                    <Form.Select
                        size="sm"
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        className="border-0 bg-white shadow-sm text-muted"
                    >
                        <option value="">Sin ordenar</option>
                        <option value="desc">Mayor a Menor</option>
                        <option value="asc">Menor a Mayor</option>
                    </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4} lg={2}>
                    <Form.Label className="small fw-medium text-dark mb-1">Fecha</Form.Label>
                    <Form.Select
                        size="sm"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border-0 bg-white shadow-sm text-muted"
                    >
                        <option value="">Sin ordenar</option>
                        <option value="desc">Más reciente</option>
                        <option value="asc">Más antigua</option>
                    </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3}>
                    <Form.Label className="small fw-medium text-dark mb-1">Nacionalidad</Form.Label>
                    <Form.Select
                        size="sm"
                        value={nationalityFilter}
                        onChange={(e) => setNationalityFilter(e.target.value)}
                        className="border-0 bg-white shadow-sm text-muted"
                    >
                        <option value="">Todas</option>
                        {nationalities.map(nationality => (
                            <option key={nationality} value={nationality}>
                                {nationality}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3}>
                    <Form.Label className="small fw-medium text-dark mb-1">Puesto</Form.Label>
                    <Form.Select
                        size="sm"
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        className="border-0 bg-white shadow-sm text-muted"
                    >
                        <option value="">Todos</option>
                        {positions.map(position => (
                            <option key={position} value={position}>
                                {position}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Barra de búsqueda */}
            <div className="mb-2">
                <InputGroup className="shadow-sm">
                    <InputGroup.Text className="bg-white border-0 text-muted">
                        <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar trabajadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-white"
                        style={{ boxShadow: 'none' }}
                    />
                    {searchTerm && (
                        <Button
                            variant="link"
                            onClick={() => setSearchTerm('')}
                            className="border-0 text-muted"
                            style={{ backgroundColor: 'white' }}
                        >
                            <i className="bi bi-x"></i>
                        </Button>
                    )}
                </InputGroup>

            </div>
        </div>
    );
};

export default ApplicationsFilters;