// using Application.Models.Queries;
// using MediatR;
// using Application.Services;
// using Domain;
//
// namespace Application.Models.Handlers
// {
//     public class GetModelsQueryHandler : IRequestHandler<GetModelsQuery, List<ReisadviesResultaat>>
//     {
//         private readonly MockDataService _mockDataService;
//
//         public GetModelsQueryHandler(MockDataService mockDataService)
//         {
//             _mockDataService = mockDataService;
//         }
//
//         public async Task<List<ReisadviesResultaat>> Handle(GetModelsQuery request, CancellationToken cancellationToken)
//         {
//             var data = _mockDataService.GetMockReisadviesResultaten();
//             return await Task.FromResult(data);
//         }
//     }
// }